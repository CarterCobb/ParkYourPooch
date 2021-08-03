package cobb.carter.registry;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class SvcRegistryApplication {

	public static void main(String[] args) {
		SpringApplication.run(SvcRegistryApplication.class, args);
	}

}
